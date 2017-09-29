package io.pivotal.fe.rhardt.web.rest;

import com.google.common.collect.ImmutableMap;
import com.google.common.collect.ImmutableSet;
import io.github.jhipster.config.JHipsterProperties;
import io.pivotal.fe.rhardt.config.DefaultProfileUtil;
import io.pivotal.fe.rhardt.config.MicroserviceSecurityConfiguration;
import io.pivotal.fe.rhardt.gateway.dto.UserDTO;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.core.env.Environment;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Resource to return information about the currently running Spring profiles.
 */
@RestController
public class AuthDetailsResource {

    private static Log log = LogFactory.getLog(AuthDetailsResource.class);

    private MicroserviceSecurityConfiguration config;

    public AuthDetailsResource(MicroserviceSecurityConfiguration config) {
        this.config = config;
    }

    @GetMapping("/authdetails")
    public Map<String, String> getAuthDetails() {
        return ImmutableMap.of("authEndpoint", this.config.getAccessTokenUri(),
            "authHeaderValue", this.config.getAuthHeaderValue());
    }


    @GetMapping("/account")
    public UserDTO getAccount() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        if (authentication != null && authentication.getPrincipal() != null) {
            String principal = authentication.getPrincipal().toString();
            log.info(authentication.getPrincipal());

            UserDTO ret = new UserDTO(10l, principal, principal, principal, principal+"@localhost",
                true, null, "en", "system", Instant.now(), "system",
                Instant.now(), ImmutableSet.of("ROLE_USER", "ROLE_ADMIN")
            );
            return ret;
        }
//        String userName = null;
//        if (authentication != null) {
//            if (authentication.getPrincipal() instanceof UserDetails) {
//                UserDetails springSecurityUser = (UserDetails) authentication.getPrincipal();
//                userName = springSecurityUser.getUsername();
//            } else if (authentication.getPrincipal() instanceof String) {
//                userName = (String) authentication.getPrincipal();
//            }
//        }
        return null;

    }



}
